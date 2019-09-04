import {Contact} from './contact';

class Dialog {
    id: number;
    subject_id: number;
    subject_type?: string;
    last_message?: Message;
    users: Array<Contact>;
    date_created: Date;
    product?: any;
    order?: any;
    unread_messages_count?: number;
}

class Message {
    id: number;
    dialog_id: number;
    sender?: Contact;
    type: string;
    system_type: string;
    date_created: Date;
    text?: string;
    file: any;
    
}


function getMessageText(message: Message): string {
    if (message.type === 'text' && message.text) {
        return message.text
    }
    if (message.type === 'file' && message.file) {
        return 'INFO_FILE_SENDING'
    }
    if (message.type === 'system') {
        switch (message.system_type) {
            case 'order_changed':
                return 'INFO_ORDER_CHANGED_BY';
            case 'order_approved':
                return 'INFO_ORDER_APPROVED_BY';
            case 'order_declined':
                return 'INFO_ORDER_DECLINED_BY';
        }
        if (message.text) {
            return message.text
        }
        if (message.file) {
            return message.file
        }
    }
    return null
}

export { Dialog, Message, getMessageText }