#include <stdio.h>
#include <assert.h>
int my_strlen(const char * p){
    assert(p);//pΪ��ʱ��Ϊ��ָ�룬Ϊ�٣�����
    int num = 0;
    while(*p++ && ++num){
        ;
    }
    return num;
}
// extern����������
int main(){
    char arr1[] = "";
    int num = my_strlen(arr1);
    printf("%d\n",num);
    printf("%s","���");
}