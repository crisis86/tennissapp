import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import editicon from './assets/icone/edit.png';
import closeicon from './assets/icone/close.png';



const Player = () => {
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);
    const myrole = sessionStorage.getItem('userrole')
    const club = sessionStorage.getItem('club')

    const navigate=useNavigate();


    useEffect(() => {

        if (club ==="" || club ===undefined) {
            navigate('/login')
        }
        if(myrole === 'admin') {
            GetUserAccess();
            loadcustomer();
        } else {

            toast.error('You are not authorized to access');
            navigate('/');
        }
       
       
    }, []);

    const loadcustomer = () => {
        

        fetch(window.$produrl+"/user?role=player&codiceclub="+club).then(res => {
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

        if (window.confirm("Sei sicuro? l'operazione porterà alla cancellazione dei dati")) {
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
                toast.success("Player Eliminato!");
                loadcustomer();
            })
        }).catch((err) => {
            toast.error(err.message);
        });


    
    }

    return (
        <div className="page-content" style={{overflowX:'scroll'}}>

            <div className="card">
                <div className="card-header">
                    <h3>Lista Giocatori</h3>
                </div>
                <div className="card-body">
                    <button onClick={handleadd} className="btn btn-success">Add (+)</button>
                    <br></br>
                    <table style={{fontSize: '14px'}} className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Pos.</th>
                                <th>Action</th>
                                <th>Email</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {custlist &&
                                custlist.sort((a, b) => a.posizione > b.posizione ? 1 : -1).map((item, index) => (
                                    <tr key={index+1}>
                                       <td>{item.id}</td>
                                       <td>{item.name}   
                                    {item.insfida===true ? ( 
                                       <span><br></br><i>In sfida</i> </span>
                                    ):(
                                        <span><br></br><i>Libero </i></span>

                                    )}
                                     {item.fuorigioco===true && 
                                       <label style={{color:'#bb2d3b'}}> - Fuorigioco</label>
                                    }
                                       </td>
                                        <td style={{ textAlign:'center'}}> <b> {item.posizione}</b></td>
                                        <td style={{display:'flex'}}>
                                            <button style={{width:'52px;', margin:'1px'}} onClick={(e) => handleedit(e, item.id)} className="btn btn-primary"><img alt="edit" src={editicon}></img></button>
                                            <button style={{width:'52px;', margin:'1px'}} onClick={(e) => handleremove(e, item.id)}   className="btn btn-danger"><img alt="edit" src={closeicon}></img></button>
                                        </td>
                                        <td>{item.email}</td>


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