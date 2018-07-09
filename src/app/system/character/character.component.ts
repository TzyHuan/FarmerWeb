import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleGroup } from './character';
import { CharacterService } from './character.service'
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
  providers: [ CharacterService ]
})
export class CharacterComponent implements OnInit {

  //列舉選項傳至Dialog
  public RoleList: RoleGroup[];

  //Parameters of Mat-Table
  public dataSource: MatTableDataSource<RoleGroup> | null;
  public displayedColumns: string[] = ['RoleId', 'RoleName', 'SortNo', 'AccessScope', 'Description', 'ParentRoleId', 'RejectScope', 'ApproveScope', 'SubmitScope', 'PassScope', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private CharacterREST:CharacterService) { }

  ngOnInit() {
     //重新讀取Mat-Table資料
     this.loadData();
  }

  
  loadData() {
    //Call api reload data
    this.CharacterREST.GetRoleGroup().subscribe((data: RoleGroup[]) => {

      console.log(data);
      this.dataSource = new MatTableDataSource<RoleGroup>(data);

      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        //this.dataSource.filterPredicate = (data, filter) => this.customFilter(data, filter);
        
      }

      //把選單資料代入Dialog選項 且 增加"無隸屬"的選項
      this.RoleList = data;
      //this.RoleList.unshift({ RoleName='無' });

    });
  }

}