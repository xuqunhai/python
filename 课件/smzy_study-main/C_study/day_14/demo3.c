
// Created by 20212 on 2024/3/27.

//ģ��ʵ��strcpy����
#include <stdio.h>
#include <string.h>
#include <assert.h>
//void my_strcpy(char*dest,char*src){
//    while((*src) != '\0'){
//        *dest = *src;
//        *dest++ = *src++;
//    }*dest = *src;
//}
//char *strcpy( char *strDestination, const char *strSource );
//void my_strcpy(char *dest,const char * src){
//    assert(src != NULL);//���ԣ��������Ϊ��ʲô�����ᷢ����Ϊ�ٵĻ����᷵�ش�����Ϣ
//    assert(dest != NULL);
//    while(*dest++ = *src++);
//}
//int main(){
//    char arr1[20] = "xxxxxxxxxxx";
//    char arr2[] = "hello";
//    char * ps = &arr1;
//    char * p = &arr2;
//    my_strcpy(ps,p);
//    printf("%s\n",arr1);
//    return 0;
//}
int main(){
    const int num = 1;
    int * ps = &num;
    *ps = 2;//const�������*����ߣ����ε���*p����ʾָ��ָ������ݣ��ǲ���ͨ��ָ��ı��
    printf("%d",num);
}
