const grpc=require('@grpc/grpc-js');
const protoLoader=require('@grpc/proto-loader')


const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor=grpc.loadPackageDefinition(packageDefinition);
const todoService=protoDescriptor.TodoService;

const server=new grpc.Server();

const todos=[
    {id:"1",title:'Buy groceries',content:'Buy all of groceries'},
    {id:'2',title:'Buy Fruits',content:"Buy fruits and vegetaables"},
]
server.addService(todoService.service,{
    listTodos:(call,callback)=>{
        callback(null,{
            todos: todos
        })
    },
    createTodo:(call,callback)=>{
        console.log("Creating Todo");
        let incomingNewTodo=call.request;
        todos.push(incomingNewTodo);
        console.log(todos);
        callback(null,incomingNewTodo);
    },
    getTodo:(call,callback)=>{
        let todoId=call.request.id;
        const response=todos.filter(todo=>todo.id==todoId);
        if (response.length>0){
              callback(null,response);
        }else{
            callback({message:'Todo not found'},null)
        }
    }
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(),
()=>{
    console.log('server started',todos);
    server.start();
})