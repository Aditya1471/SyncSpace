import { useEffect, useState } from "react";
import {
  X,
  Save,
  RotateCcw,
  Monitor,
  Type,
  Palette,
} from "lucide-react";

import "./Settings.css";

const DEFAULT_SETTINGS = {
  theme: "vs-dark",
  fontSize: 14,
  fontFamily: "Fira Code",
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  autoSave: false,
  lineNumbers: true,
  smoothScrolling: true,
};

export default function Settings({
  open,
  onClose,
  onSave,
}) {

  const [settings, setSettings] =
    useState(DEFAULT_SETTINGS);

  useEffect(() => {

    const saved =
      localStorage.getItem("editor-settings");

    if(saved){

      setSettings(JSON.parse(saved));

    }

  }, []);

  if(!open) return null;

  const update=(key,value)=>{

    setSettings(prev=>({

      ...prev,

      [key]:value

    }));

  };

  const save=()=>{

    localStorage.setItem(
      "editor-settings",
      JSON.stringify(settings)
    );

    onSave(settings);

    onClose();

  };

  const reset=()=>{

    setSettings(DEFAULT_SETTINGS);

  };

  return(

<div className="settings-overlay">

<div className="settings-window">

<div className="settings-header">

<div>

<h2>

Settings

</h2>

<p>

Customize your editor

</p>

</div>

<button
onClick={onClose}
>

<X/>

</button>

</div>

<div className="settings-body">

<div className="setting">

<label>

<Palette size={16}/>

Theme

</label>

<select

value={settings.theme}

onChange={e=>update("theme",e.target.value)}

>

<option value="vs-dark">

Dark

</option>

<option value="light">

Light

</option>

<option value="hc-black">

High Contrast

</option>

</select>

</div>

<div className="setting">

<label>

<Type size={16}/>

Font Size

</label>

<input

type="number"

min="10"

max="30"

value={settings.fontSize}

onChange={e=>

update(

"fontSize",

Number(e.target.value)

)

}

/>

</div>

<div className="setting">

<label>

<Type size={16}/>

Font Family

</label>

<select

value={settings.fontFamily}

onChange={e=>

update(

"fontFamily",

e.target.value

)

}

>

<option>

Fira Code

</option>

<option>

JetBrains Mono

</option>

<option>

Consolas

</option>

<option>

Monaco

</option>

</select>

</div>

<div className="setting">

<label>

Tab Size

</label>

<input

type="number"

min="2"

max="8"

value={settings.tabSize}

onChange={e=>

update(

"tabSize",

Number(e.target.value)

)

}

/>

</div>

<div className="toggle">

<label>

Word Wrap

</label>

<input

type="checkbox"

checked={settings.wordWrap}

onChange={e=>

update(

"wordWrap",

e.target.checked

)

}

/>

</div>

<div className="toggle">

<label>

Minimap

</label>

<input

type="checkbox"

checked={settings.minimap}

onChange={e=>

update(

"minimap",

e.target.checked

)

}

/>

</div>

<div className="toggle">

<label>

Auto Save

</label>

<input

type="checkbox"

checked={settings.autoSave}

onChange={e=>

update(

"autoSave",

e.target.checked

)

}

/>

</div>

<div className="toggle">

<label>

Line Numbers

</label>

<input

type="checkbox"

checked={settings.lineNumbers}

onChange={e=>

update(

"lineNumbers",

e.target.checked

)

}

/>

</div>

<div className="toggle">

<label>

Smooth Scrolling

</label>

<input

type="checkbox"

checked={settings.smoothScrolling}

onChange={e=>

update(

"smoothScrolling",

e.target.checked

)

}

/>

</div>

</div>

<div className="settings-footer">

<button

className="reset-btn"

onClick={reset}

>

<RotateCcw size={16}/>

Reset

</button>

<button

className="save-btn"

onClick={save}

>

<Save size={16}/>

Save

</button>

</div>

</div>

</div>

);

}