import "./Singlepost.css"
import { BiEdit } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { useLocation } from "react-router"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Context } from "../../context/Context"
import instance from "../../axios"
import AddCategory from "../addCategories/AddCategory"

const SinglePost = () => {

    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState([]);
    const { user } = useContext(Context);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState([]);
    const [desc, setDesc] = useState("");
    const [updateMode, setUpdateMode] = useState(false)

    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);

    useEffect(() => {
        const getPost = async () => {
            const response = await instance.get("/posts/" + path);
            setPost(response.data);
            setTitle(response.data.title);
            setDesc(response.data.desc);
        }
        getPost();
    }, [path]);

    const PF = "https://mern-blog-zedan.herokuapp.com/images/";

    const handleDelete = async () => {
        try {
            await instance.delete(`/posts/${post._id}`,
                {
                    data: {
                        username: user?.username,
                        admin: user.admin
                    }
                });
            window.location.replace("/");
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = async () => {
        try {
            await instance.put(`/posts/${post._id}`,
                {
                    username: user?.username,
                    title,
                    desc,
                    categories: [...category],
                    admin: user.admin
                });
            setUpdateMode(false);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="singlepost">
            <div className="singlepost_wrapper">
                {!updateMode && <>{post?.photo ? (<img src={PF + post.photo} alt="post cover" className="singlepost_img" />) : (<div className="skeleton_img" style={{ backgroundColor: `rgb(${red},${green},${blue})` }}><span>{post.title}</span></div>)}</>}
               {!updateMode && <div className="post_categories">
                    {post?.categories?.map((category, i) => (
                        <span className="singlepost_category"
                            key={i}><Link to={`/?cat=${category}`} className="link" key={i}> {category}</Link></span>
                    ))}
                </div>}
                {updateMode && <AddCategory setCategory={setCategory} />}
                {updateMode ? (<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="singlepost_inputText" />) :
                    (<h1>{title}
                        {post.username === user?.username && (<span className={user?.admin ? `singlepost_edit admin` : `singlepost_edit`}>
                            <BiEdit className="singlepost_icon"
                                onClick={() => setUpdateMode(true)}
                            />
                            <AiFillDelete className="singlepost_icon"
                                onClick={handleDelete}
                            />
                        </span>)}
                        {
                            (user?.admin && (<span className="singlepost_edit">
                                <BiEdit className="singlepost_icon"
                                    onClick={() => setUpdateMode(true)}
                                />
                                <AiFillDelete className="singlepost_icon"
                                    onClick={handleDelete}
                                />
                            </span>))
                        }
                    </h1>)}
                <div className="singlepost_info">
                    <span className="singlepost_author">Author : <Link className="link" to={`/?user=${post.username}`}><b>{post.username}</b></Link></span>
                    <span className="singlepost_date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                {updateMode ? <textarea className="textarea" value={desc} onChange={(e) => setDesc(e.target.value)}></textarea> : <p>{desc}</p>}
                {updateMode && <button className="changes" onClick={handleUpdate}>Update changes</button>}
            </div>
        </div>

    )
}

export default SinglePost
