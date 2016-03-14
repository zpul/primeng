import {Component,Input,Output,EventEmitter} from 'angular2/core';
import {TreeNode} from '../api/treenode';
import {UITreeNode} from './uitreenode';

@Component({
    selector: 'p-tree',
    template: `
        <div class="ui-tree ui-widget ui-widget-content ui-corner-all">
            <ul class="ui-tree-container">
                <p-treeNode *ngFor="#node of value" [node]="node"></p-treeNode>
            </ul>
        </div>
    `,
    directives: [UITreeNode]
})
export class Tree {

    @Input() value: TreeNode[];
        
    @Input() selectionMode: string;
    
    @Input() selection: any;
    
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeSelect: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeUnselect: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeExpand: EventEmitter<any> = new EventEmitter();
    
    @Output() onNodeCollapse: EventEmitter<any> = new EventEmitter();
    
    onNodeClick(event, node) {
        if(event.target.className&&event.target.className.indexOf('ui-tree-toggler') === 0) {
            return;
        }
        else {
            let metaKey = (event.metaKey||event.ctrlKey);
            let index = this.findIndexInSelection(node);
            let selected = (index >= 0);
                   
            if(selected && metaKey) {
                if(this.isSingleSelectionMode()) {
                    this.selectionChange.next(null);
                }
                else {
                    this.selection.splice(index,1);
                    this.selectionChange.next(this.selection);
                }

                this.onNodeUnselect.next({originalEvent: event, node: node});
            }
            else {
                if(this.isSingleSelectionMode()) {
                    this.selectionChange.next(node);
                }
                else if(this.isMultipleSelectionMode()) {
                    this.selection = (!event.metaKey) ? [] : this.selection||[];
                    this.selection.push(node);
                    this.selectionChange.next(this.selection);
                }

                this.onNodeSelect.next({originalEvent: event, node: node});
            }
        }
    }
    
    findIndexInSelection(node: TreeNode) {
        let index: number = -1;

        if(this.selectionMode && this.selection) {
            if(this.isSingleSelectionMode()) {
                index = (this.selection == node) ? 0 : - 1;
            }
            else if(this.isMultipleSelectionMode()) {
                for(let i = 0; i  < this.selection.length; i++) {
                    if(this.selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }

        return index;
    }
    
    isSelected(node: TreeNode) {
        return this.findIndexInSelection(node) != -1;         
    }
    
    isSingleSelectionMode() {
        return this.selectionMode && this.selectionMode == 'single';
    }
    
    isMultipleSelectionMode() {
        return this.selectionMode && this.selectionMode == 'multiple';
    }
}