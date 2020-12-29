import { Message } from 'discord.js';
import * as commando from 'discord.js-commando';
import { getRole } from '../../utils';
import { CONFIG, rolePerms } from '../../globals';

export default class AddCommand extends commando.Command {
  constructor(client: commando.CommandoClient) {
    super(client, {
      name: 'add',
      group: 'whitelist',
      memberName: 'add',
      description: 'Adds a role to the colour-roles whitelist',
      clientPermissions: rolePerms,
      userPermissions: rolePerms,
      throttling: {
        usages: 3,
        duration: 5,
      },
      guildOnly: true,
      args: [
        {
          key: 'roleID',
          prompt: 'make sure you\'re giving me a role',
          type: 'string',
        },
      ],
    });
  }

  public async run(
    msg: commando.CommandoMessage,
    { roleID }: { roleID: string },
  ): Promise<Message | Message[]> {
    const role = getRole(roleID, msg.guild);

    // if the first argument is the @everyone id or undefined return
    if (role === undefined || roleID === msg.guild.id) {
      return msg.reply('That\' not a role! ❌');
    }

    // Checks if the role they want to add is already added
    if (CONFIG.t3roleID.includes(role.id)) {
      return msg.say(`\`${role.name}\` is already on the whitelist! ❌`);
    }

    // Checks if the role they want to add is already on the "removal" list
    if (CONFIG.roles.includes(role.id)) {
      return msg.say(
        `\`${role.name}\` is on the remove role list, adding this to the`
        + ' whitelist would break the system! ❌',
      );
    }

    // Otherwise finally add it to the whitelist
    CONFIG.t3roleID.push(role.id);
    CONFIG.saveConfig();
    return msg.say(
      `I have added the role \`${role.name}\` to the whitelist! ✅`,
    );
  }
}
