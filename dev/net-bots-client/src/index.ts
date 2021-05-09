import { define } from 'hybrids';
import { SimpleCounter } from "./components/counter";

if (process.env.NODE_ENV !== 'production')
    module.hot?.accept();

define('simple-counter', SimpleCounter);