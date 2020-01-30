export class Message{
    from: string;
    time: string;
    nextEvent: string;
    content: string;
    avatar: string;

    constructor(from: string, content: string, nextEvent:string = null){
        this.from = from;
        this.content = content;
        this.nextEvent = nextEvent;
        let date =  new Date();
        this.time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
}