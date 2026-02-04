import { PaletteIcon } from 'lucide-react'
import React, { useState } from 'react'
import { THEMES } from '../constants'
import { useThemeStore } from '../store/useThemeStore'

const ThemeSelector = () => {
    const {theme, setTheme} = useThemeStore()

  return (
    <div className='dropdown dropdown-bottom dropdown-end'>
        <div tabIndex={0} role='button' className='btn btn-circle m-1'>
            <PaletteIcon size={19}/>
        </div>

        <div className='dropdown-content menu bg-base-100 rounded-box z-1 w-54 p-2 shadow-sm max-h-80 overflow-y-auto'>
          <ul tabIndex="-1">
            {THEMES.map((t) => (
            <li key={t.name}>
              <a
                onClick={() => setTheme(t.name)}
                className={`w-full flex items-center gap-3 transition
                  ${
                    theme === t.name
                      ? "bg-base-300"
                      : "hover:bg-base-200"
                  }`}
              >
                <PaletteIcon className="size-4" />

                <span className="font-medium">{t.label}</span>

                <div className="ml-auto flex gap-1">
                  {t.colors.map((color, i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </a>
            </li>
          ))}
          </ul>
        </div>
    </div>
  )
}

export default ThemeSelector