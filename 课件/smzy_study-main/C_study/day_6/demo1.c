//
// Created by 20212 on 3/12/2024.
//
//дһ����������Ϸ
//1.�Զ�����һ��1-100�������
//2.������
//a.��ϲ��¶��ˣ���Ϸ����
//b.��´��˾ͻ������´��˻���С��
//3�������Ϸ����һֱ�꣬�������˳���Ϸ
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
void menu(){
    printf("1.play\n");
    printf("0.exit\n" );
}
void game(){
    //��������Ϸ��ʵ��
    int guess;
    int ret = rand() % 100 +1;//rand����0-32767  %100+1��Χ����1-100
//    ������и����
    while(1){
        printf("������/n");
        scanf("%d",&guess);
        if(guess<ret){
            printf("��С��");

        }
        else if(guess>ret){
            printf("�´���");
        }
        else{
            printf("�¶���");
            break;
        }
    }
}
int main(){
//    time������������ ���ǲ�ʹ��time�Ĳ���   
//
    srand((unsigned int)time(NULL));
        int input;
        do {
            menu();
            printf("��ѡ��");
            scanf("%d", &input);
            switch (input) {
                case 1:
                    game();
                    break;
                case 0:
                    printf("�˳���Ϸ");
                    break;
                default:
                    printf("����ѡ��");
                    break;
            }
        }while(input);
        return 0;
}