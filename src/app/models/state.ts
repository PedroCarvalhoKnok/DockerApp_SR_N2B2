export interface State{
    status: string;
    running: boolean;
    paused: boolean;
    restarting: boolean;
    OOMKilled: boolean;
    dead: boolean;
    pid: number;
    exitCode: number;
    error: string;
    startedAt: string;
    finishedAt: string;
}