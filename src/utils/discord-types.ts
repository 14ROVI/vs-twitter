// To stop massive amounts of random types, stuff I won't use is Object.

export enum InteractionResponseType {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL = 9,
}

export interface Interaction {
    id: string;
    application_id: string;
    type: InteractionType;
    data?: InteractionData;
    guild_id: string;
    channel_id?: string;
    member?: Member;
    user?: User;
    token: string;
    version: number;
    message?: Message;
    app_permissions?: string;
    locale?: string;
    guild_locale?: string;
}

export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

export enum ApplicationCommandType {
    CHAT_INPUT = 1, // Slash commands; a text-based command that shows up when a user types /
    USER = 2, // A UI-based command that shows up when you right click or tap on a user
    MESSAGE = 3, // A UI-based command that shows up when you right click or tap on a message
}

export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11
}

export interface InteractionData {
    id: string;
    name: string;
    type: ApplicationCommandType;
    resolved?: InteractionResolvedData;
    options?: InteractionDataOption[];
    guild_id?: string;
    target_id?: string;
}

export interface InteractionResolvedData {
    users?: { [key: string]: User };
    members?: { [key: string]: Member };
    roles?: { [key: string]: any };
    channels?: { [key: string]: any };
    messages?: { [key: string]: Message };
    attachments?: { [key: string]: any };
}

export interface InteractionDataOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number;
    options?: InteractionDataOption[];
    focused?: boolean;
}

export interface Member {
    user?: User;
    nick?: string;
    avatar?: string;
    roles: Object;
    joined_at: string;
    premium_since: string;
    deaf: boolean;
    mute: boolean;
    pending?: boolean;
    permissions?: string;
    communication_disabled_until?: string;
}

export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar?: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}

export interface Message {
    id: string;
    channel_id: string;
    author:	User;
    content: string;
    timestamp: string;
    edited_timestamp: string | null;
    tts: boolean;
    mention_everyone: boolean;
    mentions: Object;
    mention_roles: Object;
    mention_channels?: Object;
    attachments: Object;
    embeds: Object;
    reactions?: Object;
    nonce?: number | string;
    pinned: boolean;
    webhook_id?: string;
    type: number;
    activity?: Object;
    application?: Object;
    application_id?: string;
    message_reference?: Object;
    flags?: number;
    referenced_message?: Message;
    interaction?: Object;
    thread?: Object;
    components?: Object;
    sticker_items?: Object;
    stickers?: Object;
    position?: number;
}