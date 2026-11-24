import React, { useState } from 'react';
import { SceneGraphData, SceneNode } from '../types/digitalTwinTypes';
import { 
  Folder, 
  FolderOpen, 
  Box, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Home,
  Square,
  DoorClosed,
  Maximize2
} from 'lucide-react';

interface SceneTreePanelProps {
  sceneGraph: SceneGraphData | null;
  selectedComponentId?: string | null;
  onSelectComponent: (id: string) => void;
  isDarkMode?: boolean;
}

const NodeTreeItem: React.FC<{
  node: SceneNode;
  depth: number;
  selectedComponentId?: string | null;
  onSelectComponent: (id: string) => void;
  isDarkMode?: boolean;
}> = ({ node, depth, selectedComponentId, onSelectComponent, isDarkMode = true }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const [isVisible, setIsVisible] = useState(node.visible);

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedComponentId === node.id || selectedComponentId === node.metadata?.id;

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
    node.visible = !isVisible;
  };

  const getIcon = () => {
    if (node.type === 'building') return <Home className="w-3.5 h-3.5 text-[#B59B6D]" />;
    if (node.type === 'floor') return <Layers className="w-3.5 h-3.5 text-blue-400" />;
    if (node.type === 'room') return <Square className="w-3.5 h-3.5 text-emerald-400" />;
    if (node.componentType === 'door') return <DoorClosed className="w-3.5 h-3.5 text-amber-400" />;
    if (node.componentType === 'window') return <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />;
    return <Box className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="select-none text-xs">
      <div
        onClick={() => onSelectComponent(node.metadata?.id || node.id)}
        style={{ paddingLeft: `${depth * 12 + 6}px` }}
        className={`py-1.5 px-2 rounded-sm flex items-center justify-between cursor-pointer transition ${
          isSelected 
            ? 'bg-[#B59B6D]/20 text-[#B59B6D] font-bold border-l-2 border-[#B59B6D]' 
            : isDarkMode 
              ? 'hover:bg-white/5 text-slate-300' 
              : 'hover:bg-slate-100 text-slate-700'
        }`}
      >
        <div className="flex items-center space-x-1.5 min-w-0">
          {hasChildren ? (
            <button onClick={toggleOpen} className="p-0.5 hover:text-white shrink-0">
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-3 h-3 shrink-0" />
          )}

          <span className="shrink-0">{getIcon()}</span>
          <span className="truncate">{node.name}</span>
        </div>

        <button
          onClick={toggleVisibility}
          className="p-0.5 opacity-60 hover:opacity-100 text-slate-400 hover:text-white shrink-0 ml-1"
        >
          {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-red-400" />}
        </button>
      </div>

      {hasChildren && isOpen && (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <NodeTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SceneTreePanel: React.FC<SceneTreePanelProps> = ({
  sceneGraph,
  selectedComponentId,
  onSelectComponent,
  isDarkMode = true
}) => {
  return (
    <div className={`p-3 rounded-sm border space-y-2 h-full flex flex-col ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">Scene Hierarchy</h3>
        </div>
        <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
          {sceneGraph?.totalComponents || 0} Elements
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 max-h-[320px]">
        {sceneGraph ? (
          <NodeTreeItem
            node={sceneGraph.root}
            depth={0}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="p-4 text-center text-xs text-slate-400 italic">
            No scene graph generated. Load verified model.
          </div>
        )}
      </div>
    </div>
  );
};
