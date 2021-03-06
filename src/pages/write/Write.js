import { useContext, useState } from "react"
import { BiImageAdd } from "react-icons/bi"
import instance from "../../axios";
import AddCategory from "../../components/addCategories/AddCategory";
import { Context } from "../../context/Context";
import "./Write.css"

const Write = () => {

    const [title , setTitle] = useState("");
    const [desc , setDesc] = useState("");
    const [file , setFile] = useState(null);
    const [warning , setWarning] = useState(false);
    const [error , setError] = useState(false)
    const [category , setCategory] = useState([]);
    const {user} = useContext(Context);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setWarning(true)
        const newPost = {
            username:user.username,title,desc,categories:[...category],
        }
        if(file){
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name",filename);
            data.append("file",file);
            newPost.photo=filename;
            try {
                await instance.post("/upload",data)
                setError(false);
            } catch (error) {
                setError(true);
            }

        }
        if(title!=="" && desc!==""){
            try {
                const response = await instance.post("/posts",newPost);
                setError(false);
                setWarning(false);
                window.location.replace("/post/"+response.data._id);
             } catch (error) {
                 setError(true);
             }
        }
    }

    return (
        <div className="write">
       {file && <img src={URL.createObjectURL(file)} alt="upload cover" className="write_img" />}
            <form className="write_form" onSubmit={handleSubmit}>
                {error && <p className="warning">Something went wrong , please try again </p>}
                {warning && <p className="warning">Please do not leave the blog empty</p> }
                <div className="write_form_group">
                    <label htmlFor="file">
                        <BiImageAdd className="write_form_icon"/>
                    </label>
                    <input type="file" id="file" style={{display:"none"}} onChange={e=>setFile(e.target.files[0])} accept=".png,.jpeg,.jpg,.svg"/>
                    <input type="text" placeholder="title" className="write_input"
                    onChange={e=>setTitle(e.target.value)}
                    />
                </div>
                <AddCategory setCategory={setCategory}/>
                <div className="write_form_group">
                    <textarea className="write_input textarea" cols="30" rows="10" placeholder="write your story.." onChange={e=>setDesc(e.target.value)}
                    ></textarea>
                </div>
                <button className="write_form_submit" type="submit">publish</button>
            </form>
        </div>
    )
}

export default Write
