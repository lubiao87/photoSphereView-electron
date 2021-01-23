//单例模式实现
//import { SqlDatabase } from 'ionix-sqlite/SqlDatabase'
export class DB{
    static instance = null;
/*
    constructor(name,location){
        // alert(name);
        //初始化数据库
        
        if(DB.instance){
            return DB.instance
        }
        DB.instance = window.sqlitePlugin.openDatabase({
            name: name,
            location: location,
        });
        return DB.instance;
        
    }
*/
    static getInstance(name,location){
        return new DB(name,location);
    }
    //执行sql
    static executeSql(db,sql,params,result,error){
        // alert(sql);
        db.executeSql(sql,params,result,error);
    }
        //生成随机 GUID 数
    static guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}