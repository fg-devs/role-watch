import { Guild } from 'discord.js';

export function getRole(rid: string, guild: Guild) {
  let ridParsed = rid;
  // Check if a role was tagged or not. If the role was tagged remove the
  // tag from rid.
  if (rid.startsWith('<@&') && rid.endsWith('>')) {
    const re = new RegExp('[<@&>]', 'g');
    ridParsed = rid.replace(re, '');
  }
  // Try recovering the role and report if it was successful or not.
  try {
    return guild.roles.cache.get(ridParsed);
  } catch (e) {
    console.log(`Role not found because ${e}`);
    return undefined;
  }
}
