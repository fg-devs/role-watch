import { Client, GuildMember } from 'discord.js';
import { CONFIG } from './globals';

export function onReady(bot: Client) {
  if (!bot.user) {
    return;
  }
  console.log(`${bot.user.tag} is online!`);
  bot.user.setActivity('your colour(s)', { type: 'WATCHING' });
}

/**
 * Triggered when a member updates their profile info
 * @param {GuildMember} _ Old iteration of the member's profile (not needed)
 * @param {GuildMember} mem New iteration of the member's profile
 */
export function onMemberUpdate(_: GuildMember, mem: GuildMember) {
  const check = mem.roles.cache.map((role) => role.id);

  // Loop over member roles to check if they have whitelisted roles
  const foundWhitelist = check.some(CONFIG.t3roleID.includes);

  if (foundWhitelist) {
    return;
  }

  // Loop over member roles to check if they have colour roles
  const foundColourRole = check.some(CONFIG.roles.includes);

  if (foundColourRole) {
    CONFIG.roles.forEach(async (role) => {
      const memberRoles = mem.roles.cache;
      const invalidRole = memberRoles.get(role);
      if (invalidRole) {
        await mem.roles.remove(role, 'Doesn\'t have required role');
      }
    });
  }
}
