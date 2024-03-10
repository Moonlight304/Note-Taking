const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/notes');

const PORT = 3000;

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    notes: [String],
})

const User = mongoose.model("User", userSchema);

// go to root
app.get('/', (req, res) => {
    res.render('index');

    console.log(req.query);
})

// signup or login
app.post('/signup', async (req, res) => {
    const newUser = User(req.body);
    await newUser.save();

    console.log(newUser);
    res.redirect(`/u/${newUser._id}`);
})
app.post('/login', async (req, res) => {
    const { loginUser, loginPass } = req.body;
    const existingUser = await User.findOne({ username: loginUser });

    if (existingUser && existingUser.password === loginPass)
        res.redirect(`/u/${existingUser._id}`);
    else {
        console.log("Invalid credentials");
        res.status(401).redirect('/');
    }
})

// Profile page
app.get('/u/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    res.render('profile', {
        username: user.username,
        notes: user.notes,
        id: user._id,
    });
})

// post new note
app.post('/u/:id/newNote', async (req, res) => {
    const { id } = req.params;
    const newNote = req.body.note;
    // console.log(req.body.note);

    const user = await User.findById(id);
    // console.log(user);

    await user.notes.push(newNote);
    await user.save();

    res.redirect(`/u/${id}`);
})

// delete a note
app.get('/u/deleteNote/:id/:note', async (req, res) => {
    const { id, note } = req.params;

    await User.updateOne({ _id: id }, { $pull: { notes: note } });

    res.redirect(`/u/${id}`);
})

// admin page
app.get('/admin', async (req, res) => {
    const allUsers = await User.find({});
    
    // console.log(req.query);
    // console.log(allUsers);
    res.render('admin.ejs', { allUsers })
})
app.get('/admin/:id', async (req, res) => {
    const { id } = req.params;

    await User.deleteOne({_id : id});

    res.redirect('/admin');
})

app.get('*', (req, res) => {
    res.status(404).send("OOPS... Page Not found");
})

app.listen(PORT, () => {
    console.log(`Listenting on port ${PORT}...`);
})