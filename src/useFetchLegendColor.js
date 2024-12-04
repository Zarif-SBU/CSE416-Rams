import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetchLegendColor(legendColor) {
    const [colors, setColors] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchColors = async () => {
        try {
          setLoading(true);
          const cachedColors = localStorage.getItem(`colors-${legendColor}`);
          if (cachedColors) {
            setColors(JSON.parse(cachedColors));
          } 
          else {
            const response = await axios.get(`http://localhost:8080/Data/colors/${legendColor}`);
            setColors(response.data);
            console.log("HELLOO BBB", response.data)
            localStorage.setItem(`colors-${legendColor}`, JSON.stringify(response.data));
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchColors();
    }, [legendColor]);
  
    return { colors, loading, error };
}