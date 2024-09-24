import React, { useState } from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop }) => {
  const [hasDropped, setHasDropped] = useState(false);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'MAP',
    drop: (item) => {
      onDrop(item);
      setHasDropped(true);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} style={{ width: '1vw', height: '100vh', backgroundColor: isOver ? 'lightgreen' : 'white' }}>
      {!hasDropped && (isOver ? 'Release to drop' : 'Drag the map here')}
    </div>
  );
};

export default DropZone;
