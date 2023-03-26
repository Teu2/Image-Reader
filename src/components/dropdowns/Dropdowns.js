import React from 'react';
import './Dropdowns.scss';
import { Select } from '@mantine/core';

export const Dropdowns = ({ language, handleLanguageChange, kanjiDirection, handleKanjiDirChange  }) => {
  return (
    <form>
        <Select placeholder="Translate to" size="xs" name="language" 
            data={[
                { value: 'en', label: 'English' },
                { value: 'ko', label: '한국어' },
                { value: 'cs', label: 'Česky' },
                { value: 'fr', label: 'Français' },
            ]}
            value={language}
            onChange={handleLanguageChange}
        />
        <Select placeholder="Letter Direction" size="xs" name="kanjiDirection" 
            data={[
                { value: 'hor', label: 'Horizontal' },
                { value: 'vert', label: 'Vertical' },
            ]}
            value={kanjiDirection}
            onChange={handleKanjiDirChange}
        />
    </form>
  );
}
