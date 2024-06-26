interface BotState {
    bot: Bot
    fetchStatus: string;
};

interface AIState {
    message: string;
    fetchStatus: string;
};

interface Bot {
    _id: string;
    session_id: string;
    xp: number;
    level: number;
    levelMaxXP: number
};
 
export type { Bot, BotState, AIState };