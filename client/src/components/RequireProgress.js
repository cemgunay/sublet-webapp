import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import ListFormContext from "../context/ListFormContext";

const RequireProgess = ({ children }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { backButtonClicked } = useContext(ListFormContext);
  
  useEffect(() => {
    const fetchDraftGroup = async () => {
      console.log(backButtonClicked);

      try {
        const response = await api.get("/listings/draftgroup/" + id);
        console.log(response);
        const draftGroup = response.data;
        if (
          !backButtonClicked &&
          draftGroup !== window.location.pathname.split("/").pop()
        ) {
          navigate(`/host/list/${id}/${draftGroup}`);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDraftGroup();
  }, [id, navigate, backButtonClicked]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return children;
};

export default RequireProgess;
