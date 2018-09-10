import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { MatDialog } from '@angular/material';
import { Member } from './member';
import { RoleGroup, ImemRole, RoleGroupNode } from '../character/character';
import { MemberService } from './member.service';
import { CharacterService, ImemRoleService } from '../character/character.service';

import { DialogMemberCreateComponent } from './dialog/dialog-member-create.component';
import { DialogMemberUpdateComponent } from './dialog/dialog-member-update.component';
import { DialogMemberDeleteComponent } from './dialog/dialog-member-delete.component';
import { DialogImemRoleComponent } from './dialog/dialog-ImemRole.component';
import { zip } from 'rxjs/observable/zip';

@Component({
    selector: 'system-member',
    templateUrl: './member.component.html',
    styleUrls: ['./member.component.css'],
    providers: [MemberService, ImemRoleService, CharacterService]
})
export class MemberComponent implements OnInit {


    /** 傳至dialog */
    //ImemRole
    public ImemRoleList: ImemRole[];
    public TreeRole: RoleGroupNode[];

    /** Parameters of Mat-Table */
    public dataSource: MatTableDataSource<Member> | null;
    public displayedColumns: string[]
    // = [
    //     'domain', 'firstName', 'lastName', 'deptId',
    //     'account', 'password', 'email', 'isActive',
    //     'addTime', 'updatedTime', 'actions'
    // ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private MemberREST: MemberService, private ImemRoleService: ImemRoleService,
        private CharacterService: CharacterService, public dialog: MatDialog) {
        var MemberProperty: Member = new Member();
        //console.log(test)

        //console.log(Object.getOwnPropertyNames(test))
        this.displayedColumns = Object.getOwnPropertyNames(MemberProperty);
        this.displayedColumns.push("actions");

    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        //Call api reload data
        this.MemberREST.GetMember().subscribe((data: Member[]) => {

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
        this.loadImemRole();
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

    //#region Dialog patterns
    openDeleteDialog(MemberDetial: Member): void {
        const dialogRef = this.dialog.open(DialogMemberDeleteComponent, {
            width: '250px',
            data: MemberDetial
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.reloadData();
        });
    }

    openUpdateDialog(MemberDetial: Member): void {
        const dialogRef = this.dialog.open(DialogMemberUpdateComponent, {
            width: '400px',
            data: MemberDetial
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.reloadData();
        });
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(DialogMemberCreateComponent, {
            width: '400px',
            //data: this.MemberList
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.reloadData();
        });
    }

    openImemRoleDialog(MemberDetial: Member): void {
        const dialogRef = this.dialog.open(DialogImemRoleComponent, {
            width: '350px',
            data: [MemberDetial, this.ImemRoleList, this.TreeRole]
        });

        dialogRef.afterClosed().subscribe((saved:boolean) => {
            if(saved) this.loadImemRole();
        });
    }

    reloadData(){
        this.MemberREST.GetMember().subscribe((data: Member[]) => { 
            this.dataSource.data = data;
        });
    }
    //#endregion

    loadImemRole(){
        zip(this.ImemRoleService.GetImemRole(), this.CharacterService.GetRoleGroupTree())
            .subscribe(value => {
                this.ImemRoleList = value[0];
                this.TreeRole = value[1];
            });
    }
}