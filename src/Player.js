import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Player = () => {
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);

    const navigate=useNavigate();


    useEffect(() => {
        GetUserAccess();
        loadcustomer();
       
    }, []);

    const loadcustomer = () => {
        

        fetch(window.$produrl+"/user?role=player").then(res => {
            if (!res.ok) {
               
                return false
            }
            return res.json();
        }).then(res => {
            custupdate(res)
        });
    } 

    const GetUserAccess = () => {
        const userrole = sessionStorage.getItem('userrole') != null ? sessionStorage.getItem('userrole').toString() : '';
        
        fetch(window.$produrl+"/roleaccess?role=" + userrole + "&menu=default").then(res => {
            if (!res.ok) {
                console.log(res)
               // navigate('/');
            toast.warning('You are not authorized to access');
                return false;
            }
            return res.json();
        }).then(res => {
            console.log(res);
            if (res.length > 0) {
                viewchange(true);
                let userobj = res[0];
                editchange(userobj.haveedit);
                addchange(userobj.haveadd);
                removechange(userobj.havedelete);
            }else{
                navigate('/');
            toast.warning('You are not authorized to access');
            }
        })
    }

    const handleadd = () => {
        if(haveadd){
           
     
        }else{
            toast.warning('You are not having access for add');
        }

        navigate('/register')

    }
    const handleedit = (e, param) => {
        if(haveedit){
               
        }
        else{
          toast.warning('You are not having access for Edit');
        }

        navigate('/edit/'+param)
    }

    const handleremove = (e, param) => {
      

        if(haveremove){
    //    toast.success('removed')
        }else{
           toast.warning('You are not having access for remove');
        }

        if (window.confirm("Sei sicuro?")) {
            removeplayer(param);
            loadcustomer();
        }
       
        
    }

    function removeplayer(idp) {

        fetch(window.$produrl+"/user/" + idp, {
            method: 'DELETE',
        }).then((result) => {
            //  console.log(result)
            result.json().then((resp) => {
                toast.success("Eliminato");
            })
        }).catch((err) => {
            toast.error(err.message);
        });


    
    }

    return (
        <div className="container">

            <div className="card">
                <div className="card-header">
                    <h3>Customer Listing</h3>
                </div>
                <div className="card-body">
                    <button onClick={handleadd} className="btn btn-success">Add (+)</button>
                    <br></br>
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Country</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {custlist &&
                                custlist.map((item, index) => (
                                    <tr key={index+1}>
                                       <td>{item.id}</td>
                                       <td>{item.name}</td>
                                        <td>{item.country}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button onClick={(e) => handleedit(e, item.id)} className="btn btn-primary">Edit</button> |
                                            <button onClick={(e) => handleremove(e, item.id)}   className="btn btn-danger">Remove</button>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Player;