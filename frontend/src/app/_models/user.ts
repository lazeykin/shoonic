class User {
    id: number;
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    user_type: string;
}

class NotificationsInfo {
    unread_messages_count: number;
    pending_orders_count: number;
}

class AuthUserInfo {
    token: string;
    scope: Array<string>;
    user: User;
    notifications: NotificationsInfo;
}

export { User, AuthUserInfo }
