module.exports = class{
    constructor(){
        this.rooms = [];
    }

    addRoom(room){
        this.rooms.push(room);
    }

    getRoom(id){
        for (var i = 0; i < this.rooms.length; i++){
            if (this.rooms[i].id === id){
                return this.rooms[i];
            }
        }
    }
};
