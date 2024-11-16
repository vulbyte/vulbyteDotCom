/*
"use strict"; // Ensure 'use strict' is placed at the top of the script

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SupabaseUrl, AnonKey);

export default function DBAccessTest(table: string) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from(table).select();
    setCountries(data);
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.id} className="flex flex-row">
          <div className="w-auto text-zinc-700">{country.created_at!}:</div>
          <div> </div>
          <div className="w-auto">{country.message!}</div>
        </li>
      ))}
    </ul>
  );
}
*/

export default function DBAccessText() {
  return (
    <div>
      <p> this has been disabled for now </p>
    </div>
  );
}
