import koa from 'koa';
import glob from 'glob';
import Router from 'koa-router';

export {Router};

export let Database = {
  knex: null,
  bookshelf: null,
};


export default class Koapi {
  config = {}
  koa    = null
  routers = []
  constructor(config){
    this.config = config;
    this.koa    = koa();
    this.initModel();
    this.initRouter();
  }
  initModel(){
    Database.knex = require('knex')(this.config.knex);
    Database.bookshelf = require('bookshelf')(Database.knex);
  }
  initRouter(){
    glob.sync(this.config.path.routers).forEach((path)=>{
      let router = require(path).default;
      this.routers.push(router);
      this.koa.use(router.routes());
    });
  }
  run(cb){
    cb = cb || function(){
      console.log("Server started at port " + this.config.port);
    }.bind(this);
    this.koa.listen(this.config.port || 3000, cb);
  }
}

export function Model(options){
  return Database.bookshelf.Model.extend(options);
};
