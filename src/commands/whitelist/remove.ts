import { Message } from 'discord.js';
import * as commando from 'discord.js-commando';
import { getRole } from '../../utils';
import { CONFIG, rolePerms } from '../../globals';

export default class AddCommand extends commando.Command {
  constructor(client: commando.CommandoClient) {
    super(client, {
      name: 'remove',
      group: 'whitelist',
      memberName: 'remove',
      description: 'Removes a role to the colour-roles whitelist',
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

    if (role === undefined || roleID === msg.guild.id) {
      return msg.reply('That\' not a role! ❌');
    }

    if (!CONFIG.t3roleID.includes(role.id)) {
      return msg.say(`\`${role.name}\` is not on the whitelist! ❌`);
    }

    const roleIndex = CONFIG.t3roleID.indexOf(role.id);

    CONFIG.t3roleID.splice(roleIndex, 1);
    CONFIG.saveConfig();

    return msg.say(
      `I have removed the role \`${role.name} \` from the whitelist ✅`
      + `\n*Anyone currently with \`${role.name}\` you will have to`
      + ' remove roles manually*',
    );
  }
}
