//
// Created by 20212 on 3/11/2024.
//
//do whileѭ��
#include <stdio.h>
//do ѭ����� while�����ʽ����
//int mian(){
//    int i = 1;
//    do
//    {
//    printf("%d",i);
//    i ++;
//    }while(i <= 10);
//    return 0;
//}
//int main(){
//    int i = 1;
//    do {
//        if (i ==5)//���if����ֻ��һ����������{}
//            continue;
//        printf("%d",i);
//        i ++;
//    }while(i<=10);
//}
//int main(){
//    int number;
//    scanf("%d",&number);
//    switch(number){
//        case 1:
//            printf("hello 1");
//            break;
//        default:
//            printf("���");
//    }
//}
//int main(){
//    int n = 0;
//    int num = 1;
//    int sum;
//    do{
//        sum = num*n;
//        n ++;
//        printf("%d\n",sum);
//    }while(n<=10);
//}
//int main(){
//    int n = 1;
//    int ret = 1;
//    do{
//        ret *= n;
////        printf("%d\n",ret);
//        n ++;
//        printf("%d\n",ret);
//    }while(n <= 10);
//int main(){
//    int i = 0;
//    int n =0;
//    int ret = 1;
//    scanf("%d",&n);
//    int num =0;
//    for(i=1;i<=n;i++){
//        ret *=i;
//        num += ret;
//    };
//    printf("%d",num);
//};
//int main(){
////    123456789 10
////�۰���� ���ֲ��� Ч�ʸ���
//    int arr[] = {1,2,3,4,5,6,7,8,9,10};
//    int k = 7;
////    ��arr�������������в���k��7����ֵ
//    int sz = sizeof(arr) / sizeof(arr[0]);//����Ԫ�صĸ���
//    int left = 0;
//    int right = sz-1;
//    while(left <= right) {
//        int mid = (left + right) / 2;
//        if (arr[mid] < k) {
//            left = mid + 1;
//        } else if (arr[mid] > k) {
//            right = mid - 1;
//        } else {
//            printf("�ҵ����±�Ϊ%d", mid);
//            break;
//        }
//    }
//    if (left > right){
//        printf("�Ҳ�����\n");
//
//    }
//    return 0;
////    1 2 3 4 5 6 7 8 9 10
////   left0              right9
//
//}
#include <string.h>
#include <windows.h>
//int main(){
//    char arr1[] = "welcome to bit!!!!!!";
//    char arr2[] = "####################";
//    int left = 0;
////    strlen���ڼ����ַ����ĳ���
//    int right = strlen(arr1) - 1;
//    while(left <= right)
//    {
//        arr2[left] = arr1[left];
//        arr2[right] = arr1[right];
//        printf("%s\n", arr2);
//        Sleep(1000);
//        system("cls");
//
//        left++;
//        right--;
//    }
//    return 0;
//}
//int main(){
//    int i = 0;
//    char password[20] = {0};
//password��������һ����ַ�ĵ�һλԪ��
//    for(i=0;i<3;i++){
//        printf("����������");
//        scanf("%s",&password);
//�����ڱȽ���������ĸ�ַ��ĵ�ַ
//        //        if(password == "123456")err�����ַ�������ֱ�ӱȽϣ�Ӧ����strcmp
//�Ƚ϶�Ӧ��ASCII��ֵ
//        if(strcmp(password,"123456") == 0){
//            printf("����ɹ�\n");
//            break;
//        }
//        else{
//            printf("���������������! ")
//        }
//    }
//    if(i==3){
//        printf("������������˳�����\n");
//    }
//}
