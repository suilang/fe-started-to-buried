/**
 * 
反转从位置 m 到 n 的链表。请使用一趟扫描完成反转。

说明:
1 ≤ m ≤ n ≤ 链表长度。

示例:

输入: 1->2->3->4->5->NULL, m = 2, n = 4
输出: 1->4->3->2->5->NULL
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
    let s = {
    val: 0,
    next: head,
};
let start;
let index = 0;

let s1 = s;
let tmpNode = null;
if (left === right) {
    return head;
}
while (true) {
    let next = s1.next;

    if (index === left - 1) {
        start = s1;
    }
    if (index === left) {
        start1 = s1;
        tmpNode = s1;
    }
    if (index > left && index <= right) {
        s1.next = tmpNode || null;
        tmpNode = s1;
    }
    if (index === right) {
        start.next = s1 || null;
        start1.next = next || null
        break;
    } 
    s1 = next;
    index++;
}

return s.next;
};