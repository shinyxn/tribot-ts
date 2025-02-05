import { downloadMediaMessage, getContentType } from '@whiskeysockets/baileys'
import { ipaddr } from '../commands/ip.js'
import { helpCommand } from '../commands/help.js'
import { speedtest } from '../commands/speedtest.js'
import { shell } from '../commands/shell.js'
import { sticker } from '../commands/sticker.js'
import { tiktok } from '../commands/tiktok.js'
import utils from './utils.js'

export default async function (sock: any, m: any): Promise<void> {
    const senderNumber: string = m.key.remoteJid

    if (m.message) {
        m.mtype = getContentType(m.message)

        try {
            var body =
                m.mtype === 'conversation'
                    ? m.message.conversation
                    : m.mtype == 'imageMessage'
                    ? m.message.imageMessage.caption
                    : m.mtype == 'videoMessage'
                    ? m.message.videoMessage.caption ||
                      m.message.extendedTextMessage.contextInfo.quotedMessage
                          .videoMessage
                    : m.mtype == 'extendedTextMessage'
                    ? m.message.extendedTextMessage.text ||
                      m.message.extendedTextMessage.contextInfo.quotedMessage
                          .conversation
                    : m.mtype == 'ephemeralMessage'
                    ? m.message.ephemeralMessage.message.extendedTextMessage
                          .text
                    : m.mtype == 'buttonsResponseMessage'
                    ? m.message.buttonsResponseMessage.selectedButtonId
                    : m.mtype == 'listResponseMessage'
                    ? m.message.listResponseMessage.singleSelectReply
                          .selectedRowId
                    : m.mtype == 'templateButtonReplyMessage'
                    ? m.message.templateButtonReplyMessage.selectedId
                    : m.mtype === 'messageContextInfo'
                    ? m.message.buttonsResponseMessage?.selectedButtonId ||
                      m.message.listResponseMessage?.singleSelectReply
                          .selectedRowId ||
                      m.text
                    : ''
        } catch (e) {
            console.log(e)
        }
    }

    // const reply = async (senderNumber: string, text: string, m: any) => {
    //   await sock.sendMessage(senderNumber, { text }, { quoted: m });
    // };

    try {
        let prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : '/'
        const firstmess = body.startsWith(prefix)
        let pesan = body
            .replace(prefix, '')
            .trim()
            .split(/ +/)
            .shift()
            .toLowerCase()
        m.args = body.trim().split(/ +/).slice(1)

        if (firstmess) {
            switch (pesan) {
                case 'help':
                    await helpCommand(senderNumber, m)
                    break
                case 'p':
                    console.log(m.args)
                    break
                case 'ip':
                    await ipaddr(senderNumber)
                    break
                case 'test':
                    utils.sendText('testo testo', senderNumber)
                    break
                case 'speedtest':
                    utils.sendText(
                        'Performing server speedtest...',
                        senderNumber
                    )
                    await speedtest(senderNumber, m)
                    break
                case 'shell':
                    await shell(m.args, senderNumber, m)
                    break
                case 'sticker':
                    const media = await downloadMediaMessage(m, 'buffer', {})
                    await sticker(senderNumber, media, m)
                    break
                case 'tiktok':
                    await tiktok(m.args, senderNumber, m)
                    break
            }
        }
    } catch (err) {
        console.log(err)
    }
}
