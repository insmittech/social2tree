import { useState, useEffect } from 'react';

export function usePageSelector() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(() => {
    return localStorage.getItem('s2t_selected_page_id');
  });

  const selectPage = (id: string) => {
    setSelectedPageId(id);
    localStorage.setItem('s2t_selected_page_id', id);
  };

  return { selectedPageId, setSelectedPageId: selectPage };
}
