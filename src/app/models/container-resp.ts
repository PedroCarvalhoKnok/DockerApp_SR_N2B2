import { State } from "./state";

export interface ContainerResponse{
    shortId: string;
    image: string;
    name: string;
    createdAt: string;
    state: State;
    ports: {};
}