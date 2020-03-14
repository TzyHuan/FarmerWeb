import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { zip } from 'rxjs/observable/zip';
import { Member } from '../../../interface/system_auth/member';
import { RoleGroupNode } from '../../../interface/system_auth/vm_i_role';
import { IMemberRole } from '../../../interface/system_auth/i_member_role';
import { MemberService } from '../../../api/system_auth/member.service';
import { RoleGroupService } from '../../../api/system_auth/role_group.service';
import { IMemberRoleService } from '../../../api/system_auth/i_member_role.service';

import { DialogMemberCreateComponent } from './dialog/dialog-member-create.component';
import { DialogMemberUpdateComponent } from './dialog/dialog-member-update.component';
import { DialogMemberDeleteComponent } from './dialog/dialog-member-delete.component';
import { DialogIMemberRoleComponent } from './dialog/dialog-i-member-role.component';

@Component({
    selector: 'system-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.css'],
    providers: [MemberService, IMemberRoleService, RoleGroupService],
})
export class MemberComponent implements OnInit {
    /** 傳至dialog */
    //IMemberRole
    iMemberRoleList: IMemberRole[];
    treeRole: RoleGroupNode[];

    /** Parameters of Mat-Table */
    dataSource: MatTableDataSource<Member> | null;
    displayedColumns: string[] = [
        'domain', 'firstName', 'lastName',
        'account', 'password', 'email', 'isActive',
        'addTime', 'updatedTime', 'actions',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        public dialog: MatDialog,
        private memberService: MemberService,
        private roleGroupService: RoleGroupService,
        private iMemberRoleService: IMemberRoleService,
    ) {
        console.log(this.displayedColumns);
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        //Call api reload data
        this.memberService.getMember().subscribe((data: Member[]) => {

            this.dataSource = new MatTableDataSource<Member>(data);

            if (this.dataSource) {
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
                this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);

                // //#region 開始監聽來至各FormControl地filter有無輸入關鍵字
                // //Listen MemberIdFilter
                // this.MemberIdFilter.valueChanges.subscribe(value => {
                //   this.filterValues.MemberId = value;
                //   this.dataSource.filter = JSON.stringify(this.filterValues);
                //   this.dataSource.paginator.firstPage();
                // });
                // //Listen pathFilter
                // this.pathFilter.valueChanges.subscribe(value => {
                //   this.filterValues.path = value;
                //   this.dataSource.filter = JSON.stringify(this.filterValues);
                //   this.dataSource.paginator.firstPage();
                // });
                // //Listen MemberTextFilter
                // this.MemberTextFilter.valueChanges.subscribe(value => {
                //   this.filterValues.MemberText = value;
                //   this.dataSource.filter = JSON.stringify(this.filterValues);
                //   this.dataSource.paginator.firstPage();
                // });
                // //Listen sortNoFilter
                // this.sortNoFilter.valueChanges.subscribe(value => {
                //   this.filterValues.sortNo = value;
                //   this.dataSource.filter = JSON.stringify(this.filterValues);
                //   this.dataSource.paginator.firstPage();
                // });
                // //Listen componentFilter
                // this.componentFilter.valueChanges.subscribe(value => {
                //   this.filterValues.component = value;
                //   this.dataSource.filter = JSON.stringify(this.filterValues);
                //   this.dataSource.paginator.firstPage();
                // });
                // //Listen rootMemberIdFilter
                // this.rootMemberIdFilter.valueChanges.subscribe(value => {
                //   this.filterValues.rootMemberId = value;
                //   this.dataSource.filter = JSON.stringify(this.filterValues);
                //   this.dataSource.paginator.firstPage();
                // });
                // //#endregion
            }
        });

        //進頁面先查詢再傳至dialog
        this.loadIMemberRole();
    }

    customFilter(Data: Member, Filter: string): boolean {
        //取Filter條件
        let searchTerms = JSON.parse(Filter);

        //先預判是否有沒有值的欄位，無值不篩選進來
        // let JudgedMemberId: boolean = isNullOrUndefined(Data.MemberId) ?
        //   true : Data.MemberId.toString().toLowerCase().indexOf(searchTerms.MemberId.toLowerCase()) != -1

        // let JudgedPath: boolean = isNullOrUndefined(Data.path) ?
        //   true : Data.path.toString().toLowerCase().indexOf(searchTerms.path.toLowerCase()) != -1

        // let JudgedMemberText: boolean = isNullOrUndefined(Data.MemberText) ?
        //   true : Data.MemberText.toString().toLowerCase().indexOf(searchTerms.MemberText.toLowerCase()) != -1

        // let JudgedSortNo: boolean = isNullOrUndefined(Data.sortNo) ?
        //   true : Data.sortNo.toString().toLowerCase().indexOf(searchTerms.sortNo.toLowerCase()) != -1

        // let JudgedComponent: boolean = isNullOrUndefined(Data.component) ?
        //   true : Data.component.toString().toLowerCase().indexOf(searchTerms.component.toLowerCase()) != -1
        // //Because of data.rootMemberId may contain null, searchTerms without anything should not filter out this data
        // let JudgedRootMemberId: boolean = searchTerms.rootMemberId == "" ?
        //   true : (isNullOrUndefined(Data.rootMemberId) ?
        //     false : Data.rootMemberId.toString().toLowerCase().indexOf(searchTerms.rootMemberId.toLowerCase()) != -1);

        //交集為true者，才是要顯示的Dat
        return true//JudgedMemberId && JudgedPath && JudgedMemberText && JudgedSortNo && JudgedComponent && JudgedRootMemberId
    }

    openDeleteDialog(memberDetial: Member): void {
        const dialogRef = this.dialog.open(DialogMemberDeleteComponent, {
            width: '250px',
            data: memberDetial,
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.reloadData();
        });
    }

    openUpdateDialog(memberDetial: Member): void {
        const dialogRef = this.dialog.open(DialogMemberUpdateComponent, {
            width: '400px',
            data: memberDetial,
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.reloadData();
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DialogMemberCreateComponent, {
            width: '400px',
            //data: this.MemberList,
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.reloadData();
        });
    }

    openIMemberRoleDialog(memberDetial: Member): void {
        const dialogRef = this.dialog.open(DialogIMemberRoleComponent, {
            width: '350px',
            data: [memberDetial, this.iMemberRoleList, this.treeRole]
        });

        dialogRef.afterClosed().subscribe((saved: boolean) => {
            if (saved) this.loadIMemberRole();
        });
    }

    reloadData() {
        this.memberService.getMember().subscribe((data: Member[]) => {
            this.dataSource.data = data;
        });
    }

    loadIMemberRole() {
        zip(
            this.iMemberRoleService.getIMemberRole(),
            this.roleGroupService.getRoleGroupTree(),
        ).subscribe(([iMemberRoles, roleGroups]) => {
            this.iMemberRoleList = iMemberRoles;
            this.treeRole = roleGroups;
        });
    }
}
