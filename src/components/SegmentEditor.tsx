import React from 'react';

export interface Segment {
  length: number;
  axis: 'x' | 'y' | 'z';
  speed: number;
  id: number;
}

interface SegmentEditorProps {
  segments: Segment[];
  setSegments: React.Dispatch<React.SetStateAction<Segment[]>>;
}

const SegmentEditor: React.FC<SegmentEditorProps> = ({ segments, setSegments }) => {

  const handleSegmentChange = (index: number, field: keyof Omit<Segment, 'id'>, value: string | number) => {
    const newSegments = [...segments];
    const segmentToUpdate = { ...newSegments[index] };

    if (field === 'axis') {
      segmentToUpdate[field] = value as 'x' | 'y' | 'z';
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        segmentToUpdate[field] = numValue;
      }
    }
    
    newSegments[index] = segmentToUpdate;
    setSegments(newSegments);
  };

  const addSegment = () => {
    setSegments([...segments, { length: 2, axis: 'x', speed: 1, id: Date.now() }]);
  };

  const deleteSegment = (idToDelete: number) => {
    setSegments(segments.filter(segment => segment.id !== idToDelete));
  };

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: 10, borderRadius: 5 }}>
      <h3>Spirograph Controls</h3>
      {segments.map((segment, index) => (
        <div key={segment.id} style={{ marginBottom: 10, padding: 5, border: '1px solid #555', borderRadius: 3 }}>
          <h4>Segment {index + 1}</h4>
          <label> Length: </label>
          <input
            type="number"
            value={segment.length}
            onChange={(e) => handleSegmentChange(index, 'length', e.target.value)}
            style={{ width: 50, color: 'black' }}
          />
          <label> Speed: </label>
          <input
            type="number"
            value={segment.speed}
            onChange={(e) => handleSegmentChange(index, 'speed', e.target.value)}
            style={{ width: 50, color: 'black' }}
          />
          <label> Axis: </label>
          <select
            value={segment.axis}
            onChange={(e) => handleSegmentChange(index, 'axis', e.target.value)}
            style={{ color: 'black' }}
          >
            <option value="x">X</option>
            <option value="y">Y</option>
            <option value="z">Z</option>
          </select>
          <button onClick={() => deleteSegment(segment.id)} style={{ marginLeft: 10, color: 'black' }}>Delete</button>
        </div>
      ))}
      <button onClick={addSegment} style={{ color: 'black' }}>Add Segment</button>
    </div>
  );
};

export default SegmentEditor;
