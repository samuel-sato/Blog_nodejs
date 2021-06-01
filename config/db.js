if(process.env.NNODE_ENV =="production"){
    module.exports = {mongoURI: "mongodb+srv://samuel:1z7hj333@blog-node.bn1it.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}