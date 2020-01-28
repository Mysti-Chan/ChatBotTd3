export class Message{
    from: string
    time: string
    content: string

    constructor(from: string, content: string){
        this.from = from;
        this.content = content;
        let date =  new Date();
        this.time = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
}