import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Customer = () => {
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
        let player2=false;

        fetch(window.$produrl+"/user?role=player").then(res => {
            if (!res.ok) {
                player2=true
                return false
            }
            return res.json();
        }).then(res => {
            custupdate(res)
        });
    } 

    const GetUserAccess = () => {
        const userrole = sessionStorage.getItem('userrole') != null ? sessionStorage.getItem('userrole').toString() : '';
        console.log(userrole);
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
        toast.success('added')
        }else{
            toast.warning('You are not having access for add');
        }
    }
    const handleedit = () => {
        if(haveedit){
        toast.success('edited')
        }
        else{
            toast.warning('You are not having access for Edit');
        }
    }

    const handleremove = () => {
        if(haveremove){
        toast.success('removed')
        }else{
            toast.warning('You are not having access for remove');
        }
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
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {custlist &&
                                custlist.map(item => (
                                    <tr key={item.numberuser}>
                                        <td>{item.numberuser}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button onClick={handleedit} className="btn btn-primary">Edit</button> |
                                            <button onClick={handleremove} className="btn btn-danger">Remove</button>
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

export default Customer;