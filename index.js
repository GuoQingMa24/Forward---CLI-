#!/usr/bin/env node

const commander = require('commander')
const {program} = require("commander");
const download = require("download-git-repo")
const handlebars = require("handlebars")
const inquirer = require("inquirer")//用来对数据进行采集
const fs = require("fs")//读取文件
const ora =require("ora")
const chalk = require("chalk")
const logSymbols = require("log-symbols")
//1.获取用户的输入命令

// console.log(process.args);
// //2.更具不同的执行 执行不同的功能操作
//
program
    .version('0.1.0')

const templates = {
    'tpl-a':{
        url:'https://github.com/GuoQingMa24/tpl-a',
        downloadUrl:'https://github.com/GuoQingMa24/tpl-a#master',
        description:'a模板'
    },
    'tpl-b':{
        url:'https://github.com/GuoQingMa24/tpl-b',
        downloadUrl:'https://github.com/GuoQingMa24/tpl-b#master',
        description: 'b模板'
    },

    'tpl-c':{
        url:'https://github.com/GuoQingMa24/tpl-c',
        downloadUrl:'https://github.com/GuoQingMa24/tpl-c#master',
        description:'c模板'
    }
}
//接下来我们希望 当使用命令 Forward init a a-name
//此时基于a模板进行初始化
//接下来我们希望 当使用命令 Forward init b b-name
//此时基于b模板进行初始化

program
    .command('init <template> <project-name>')
    .description('初始化项目模板')
    .action((templateName,projectName)=>{
        //下载之前做loading提示
        const spinner = ora('加载中Loading~').start()
        const {downloadUrl} = templates[templateName]
        //根据模板名下载对应的模板到本地并起名字为project
        download(downloadUrl,projectName,{clone:true},(err)=>{

            if(err){
                spinner.fail()
                console.log(logSymbols.error,chalk.redBright("初始化项目失败！"))
                return
            }
            spinner.succeed()
            //把项目下的package.json文件进行读取
            //使用向导的方式采集用户字段输入的值
            //使用模板硬气把用户输入的数据解析到package.json文件中
            //解析完毕，把解析之后的结果
            inquirer.prompt([{
                type:'input',
                name:'name',
                message:'请输入项目名称'
            },{
                type:'input',
                name:'description',
                message:'请输入项目简介'
            },{
                type:'input',
                name:'author',
                message:'请输入作者名称'
            }]).then((answers)=>{
                //采集到的数据解析到package.json中
                const packagePath = `${projectName}/package.json`
                const packageContent = fs.readFileSync(packagePath,'utf-8')
                const packageResult = handlebars.compile(packageContent)(answers)
                fs.writeFileSync(packagePath,packageResult)
                console.log(logSymbols.success,chalk.blueBright("初始化项目成功！"))


            })


        })



    })

program
    .command('list')
    .description('查看可用模板')
    .action(()=>{
       for (let key in templates){
           console.log(`
           ${key} ${templates[key].description}
           `)
       }
    })
program.parse(process.argv);