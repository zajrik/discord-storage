import { Client, TextChannel, Message, Collection } from 'discord.js';

export default class Storage
{
	private _client: Client;
	private _channel: TextChannel;
	private _cache: Collection<string, Message>;

	public constructor(client: Client, channel: TextChannel | string)
	{
		this._client = client;
		const id: string = (<TextChannel> channel).id ? (<TextChannel> channel).id : <string> channel;
		this._channel = <TextChannel> this._client.channels.get(id);
		this._cache = new Collection<string, Message>();
	}

	/**
	 * Find the message containing the stored item
	 */
	private _find(key: string): Message
	{
		const message: Message = this._cache.find((m: Message) =>
			m.content.includes(`"key":"${key}"`));
		return message || null;
	}

	/**
	 * Index the storage channel, caching all messages
	 */
	public async sync(): Promise<void>
	{
		let messages: any = await this._channel.fetchMessages({ limit: 100 });
		while (true)
		{
			if (messages.size < 100) break;
			let fetched: any = await this._channel.fetchMessages({ limit: 100, before: messages.last().id });
			messages = messages.concat(fetched);
			if (fetched.size < 100) break;
		}
		this._cache = messages;
	}

	/**
	 * Check if stored key exists
	 */
	public exists(key: string): boolean
	{
		return Boolean(this._find(key));
	}

	/**
	 * Set a value in storage
	 */
	public async set(key: string, value: any): Promise<void>
	{
		if (JSON.stringify({key: key, value: value}).length > 1990)
			throw new RangeError('Data is too large to be stored');
		const message: Message = this._find(key);
		const data: string = JSON.stringify({ key: key, value: value});
		if (message)
		{
			message.content = data;
			this._cache.set(message.id, message);
			message.edit(data);
		}
		else
		{
			const msg: Message = <Message> await this._channel.send(data);
			this._cache.set(msg.id, msg);
		}
	}

	/**
	 * Get a value from storage
	 */
	public get(key: string): any
	{
		const message: Message = this._find(key);
		if (message) return JSON.parse(message.content).value;
		return null;
	}

	/**
	 * Remove a value from storage
	 */
	public async remove(key: string): Promise<void>
	{
		const message: Message = this._find(key);
		if (!message) return;
		await message.delete();
		this._cache.delete(message.id);
	}

	/**
	 * Clear all data from the channel
	 */
	public async clear(): Promise<void>
	{
		while (true)
		{
			const msgs: any = await this._channel.fetchMessages({ limit: 100 });
			if (msgs.size === 0) break;
			if (msgs.size === 1) await msgs.deleteAll();
			else await this._channel.bulkDelete(msgs);
			if (msgs.size < 100) break;
		}
		this._cache.clear();
	}
}
