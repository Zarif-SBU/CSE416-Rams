import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MAP',
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }} className='dragDesign'>
      {name}
    </div>
  );
};

export default DraggableItem;