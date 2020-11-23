const express = require("express")
const mongoose = require("mongoose")

const app = express()

function handleError(error){
	console.log(error)
}

// Models
const TodoTask = require("./models/TodoTask")

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

// DB Config
//Test
// mongoose.connect('mongodb://db:27017', {useNewUrlParser: true}, () => {
// 	console.log("Connected to DB")
// 	//app.listen(3000, ()=> console.log("Server Up and Running"))
// })

mongoose.connect('mongodb://mongodb-svc:27017', { useNewUrlParser: true }).
  catch(error => handleError(error));


app.listen(3000, ()=> console.log("Server Up and Running"))


// app.get('/', (req, res) => {
// 	res.render(`<h1>hello world</h1>`)
// })


app.get('/', (req, res) => {
	TodoTask.find({}, (err, tasks) => {
		res.render("todo.ejs", { todoTasks: tasks })
	})
})

app.post('/', async(req, res) => {
	const todoTask = new TodoTask({
		content: req.body.content
	})

	try{
		await todoTask.save()
		console.log('success')
		res.redirect("/")
	} catch (err) {
		res.redirect("/")
	}
})

app.route("/edit/:id")
	.get((req, res) => {
		const id = req.params.id
		TodoTask.find({}, (err, tasks) => {
			res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id })
		})
	})
	.post((req, res) => {
		const id = req.params.id;
		TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
		if (err) return res.send(500, err);
			res.redirect("/");
		})
	})

app.route("/remove/:id")
	.get((req, res) => {
		const id = req.params.id;
		TodoTask.findByIdAndRemove(id, err => {
		if (err) return res.send(500, err);
			res.redirect("/");
		})
	})

