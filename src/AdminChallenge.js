import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import editicon from './assets/icone/edit.png';
import closeicon from './assets/icone/close.png';


const AdminChallenge = () => {
    const [challenge, challengelist] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);
    const myrole = sessionStorage.getItem('userrole')
    const club = sessionStorage.getItem('club')

    const navigate=useNavigate();


    useEffect(() => {
        if(club==="" || club === undefined){
            navigate('/login');    
        }
        
        if(myrole === 'admin') {
            GetUserAccess();
            loacdchallenger();
        } else {

            toast.error('You are not authorized to access');
            navigate('/');
        }
       
       
    }, []);

    const loacdchallenger = () => {
        

        fetch(window.$produrl+"/challenge").then(res => {
            if (!res.ok) {
               
                return false
            }
            return res.json();
        }).then(res => {
            challengelist(res)
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

   
    const handleedit = (e, param) => {
        if(haveedit){
               
        }
        else{
          toast.warning('You are not having access for Edit');
        }

        navigate('/EditChallenge/'+param)
    }

    const handleremove = (e, param) => {
      

        if(haveremove){
    //    toast.success('removed')
        }else{
           toast.warning('You are not having access for remove');
        }

        if (window.confirm("Sei sicuro? l'operazione porterà alla cancellazione dei dati")) {
            removechallenge(param);
            loacdchallenger();
        }
       
        
    }

    function removechallenge(idc) {

        fetch(window.$produrl+"/challenge/" + idc, {
            method: 'DELETE',
        }).then((result) => {
            //  console.log(result)
            result.json().then((resp) => {
                toast.success("challenge Eliminato!");
                
            })
        }).catch((err) => {
            toast.error(err.message);
        });


    
    }

    return (
        <div className="page-content" style={{overflowX:'scroll'}}>

            <div className="card">
                <div className="card-header">
                    <h3>Lista Challenge</h3>
                </div>
                <div className="card-body">
             
                    <table style={{fontSize: '14px'}} className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>EV</th>
                                <th>Plr 1</th>
                                <th>Plr 2</th>
                                <th>Status</th>
                                <th>Action</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {challenge &&
                                challenge.sort((a, b) => a.id < b.id ? 1 : -1).map((item, index) => (
                                    <tr key={index+1}>
                                       <td>{item.id}</td>
                                       <td style={{color: item.finalplayer === item.players[0].idp1 ? '#0d6efd' : '#000'}}>{item.players[0].p1} {item.players[0].Posizp1}</td>
                                        <td style={{color: item.finalplayer === item.players[1].idp2 ? '#0d6efd' : '#000'}}>{item.players[1].p2} {item.players[1].Posizp2}</td>
                                        <td style={{textTransform: 'capitalize'}}>{item.status}</td>
                                        <td style={{display:'flex'}}>
                                            <button style={{width:'52px;', margin:'1px'}} onClick={(e) => handleedit(e, item.id)} className="btn btn-primary"><img alt="edit" src={editicon}></img></button>
                                            <button disabled={item.id===1} style={{width:'52px;', margin:'1px'}} onClick={(e) => handleremove(e, item.id)}   className="btn btn-danger"><img alt="edit" src={closeicon}></img></button>
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

export default AdminChallenge;