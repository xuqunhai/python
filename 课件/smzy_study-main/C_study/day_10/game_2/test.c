//
// Created by 20212 on 2024/3/22.
//
#include "game.h"
//1.������
//2.�Ų���
void game(){
    srand((unsigned int)time(NULL));
    char mine[ROWS][COLS] = {0};
    char show[ROWS][COLS] = {0};
    InitBoard(mine,ROWS,COLS,'0');
    InitBoard(show,ROWS,COLS,'*');

//    DisPlayBoard(mine,ROW,COL);
//    �Ų���
    SetMine(mine,ROW,COL);
//    DisPlayBoard(show,ROW,COL);
    DisPlayBoard(mine,ROW,COL);


}
void menu(){
    printf("****************************\n");
    printf("****************************\n");
    printf("******   1.paly   **********\n");
    printf("******   2.exit   **********\n");
    printf("****************************\n");
}
int main(){
    int input = 0;
    do {
        menu();
        printf("��ѡ��:>\n");
        scanf("%d", &input);
        switch (input) {
            case 1:
                printf("ɨ��\n");
                game();
                break;
            case 0:
                printf("�˳�\n");
                break;
            default:
                printf("�����������������\n");
                break;
        }
    } while (input);
}