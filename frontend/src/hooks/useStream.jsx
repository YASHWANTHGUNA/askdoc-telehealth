import { useContext } from "react";
import { StreamContext } from "../contexts/StreamContext";

export const useStream = () => useContext(StreamContext);
