export type Notification = {
    id: number,
    text: string,
    sub: string,
    time: string,
    iconColor : string,
    icon: string
}

export const notifications: Notification[] = [
    {id:1, text:'New Member Yogesh rai is register ' , sub: 'Welcome new Member Yogesh Rai' , time: '5 min ago' , iconColor: 'bg-green-100', icon:'👤'},
    {id:1, text:'New Member Roshan Karki is register ' , sub: 'Welcome new Member Roshan Karki' , time: '1 hrs ago' , iconColor: 'bg-red-100', icon:'👤'},
    {id:1, text:'New Member Safal Pokhrel is register ' , sub: 'Welcome new Member Safal Pokhrel' , time: '10 min ago' , iconColor: 'bg-blue-100', icon:'👤'},
    {id:1, text:'New Member Alok Gupta is register ' , sub: 'Welcome new Member Alok Gupta' , time: '15 min ago' , iconColor: 'bg-purple-100', icon:'👤'},
]