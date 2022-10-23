import { Env } from "..";

export abstract class Command {
    abstract name: string;
    abstract description?: string;
    abstract type: ApplicationCommandType;
    abstract options?: CommandOption[];

    abstract execute(
        env: Env,
        interaction: Interaction,
    ): Promise<Response>;
}

export interface CommandOption {
    type: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
}